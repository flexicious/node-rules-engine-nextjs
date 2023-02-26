import { executeRule } from "@euxdt/node-rules-engine";
import { CONFIG } from "@/shared/config-bindings";
import { loadConfigApi } from "@/shared/config-utils";
import { Product, ProductApiResponse, SlotNames } from "@/shared/types";
import type { NextApiRequest, NextApiResponse } from "next";
/// @ts-ignore
import { Database } from "sqlite-async";
import { PRODUCTS } from "@/shared/products";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ProductApiResponse|{message:string}>
) => {
    //Ensure the user is logged in
    const session = await getServerSession(req, res, authOptions)
    const db = await Database.open("database.db");
    const user = await db.get(`SELECT [id], [username], [email], [birthdate], [gender]
    FROM [users]
   WHERE [email] = ? 
   LIMIT 1`, [session?.user?.email])


    if(!user) {
        return res.status(401).send({message: "Unauthorized No user"});
    }

    //This would come from environment variables, but for the sake of the demo, we'll hard code it
    const environment = "prd";
    
    //Load the config
    const configApi = await loadConfigApi("GET_PRODUCTS");

    //Get the slot names from the dynamic config we defined in the lambda genie console
    const slotNames = JSON.parse(await configApi.getConfigValue(CONFIG.LAMBDA_CONFIGS.GET_PRODUCTS.SLOT_NAMES, environment)) as SlotNames;

    //Default the slot names to some values if they aren't defined in the dynamic config
    const slot1 = [slotNames.slot1] || ["Home & Kitchen"];
    const slot2 = [slotNames.slot2] || ["Clothing, Shoes & Jewelry"];
    const slot3 = [slotNames.slot3] || ["Learning & Education"];
    const slot4 = [slotNames.slot4] || ["Hobbies"];
    const maxProducts = slotNames.maxProducts || 4;
    //Get the featured products from the dynamic config we defined in the lambda genie console
    const featuredProducts = JSON.parse(await configApi.getConfigValue(CONFIG.LAMBDA_CONFIGS.GET_PRODUCTS.FEATURED_PRODUCTS, environment)) as Product[];

    //Get the slot 2 rules from the rule set we defined in the lambda genie console, which allow 
    //us to dynamically change the slot 2 category based on the user's age and gender 

    const slot2Rules = configApi.configJson.ruleSets.find((ruleSet) => ruleSet.name === CONFIG.RULE_SETS.HOME_PAGE_PERSONALIZATION);
    const userInfo = {
        ...user,
        name: user.username,
        age: user.birthdate ? Math.floor((new Date().getFullYear() - new Date(user.birthdate).getFullYear())) : 25
    };
    if (slot2Rules) {
        //Execute the rules and get the result
        const slot2RuleResult = executeRule(slot2Rules,
            configApi.configJson.predefinedLists, userInfo, environment);
        if (slot2RuleResult && slot2RuleResult.result) {
            //this will be one of Men, Women, Boys, or Girls [As defined in the rule set in the lambda genie console]
            slot2.push(String(slot2RuleResult.result));
        }
    }
    //Now, lets get the next gen feature flag from the rule set we defined in the lambda genie console
    let nextGenFeature = false;
    const featureFlagRules = configApi.configJson.ruleSets.find((ruleSet) => ruleSet.name === CONFIG.RULE_SETS.NEXT_GEN_FEATURE);
    if (featureFlagRules) {
        //Execute the rules and get the result
        const featureFlagRuleResult = executeRule(featureFlagRules,
            configApi.configJson.predefinedLists, userInfo, environment);
        nextGenFeature = featureFlagRuleResult.result ? true : false;
        console.log("featureFlagRuleResult", featureFlagRuleResult);
    }
    //For now, we are just loading the products from a local file, but this could be replaced with a call to a database or an API
    const getProducts = (slot: string[]) => {
        return PRODUCTS.filter((product) => {
            return slot.every((category) => {
                return product.categories.includes(category);
            });
        }).slice(0, maxProducts);
    };

    //Get the products for each slot
    const slot1Products = getProducts(slot1);
    const slot2Products = getProducts(slot2);
    const slot3Products = getProducts(slot3);
    const slot4Products = getProducts(slot4);

    //Return the full result
    const response ={
        slot1: slot1[0],
        slot2: slot2[0],
        slot3: slot3[0],
        slot4: slot4[0],
        slot1Products,
        slot2Products,
        slot3Products,
        slot4Products,
        featuredProducts,
        nextGenFeature
    }

    res.status(200).json(response);
}

export default handler;