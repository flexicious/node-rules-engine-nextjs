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
    const session = await getServerSession(req, res, authOptions)
    const db = await Database.open("database.db");
    const user = await db.get(`SELECT [id], [username], [email], [birthdate], [gender]
    FROM [users]
   WHERE [email] = ? 
   LIMIT 1`, [session?.user?.email])


    if(!user) {
        return res.status(401).send({message: "Unauthorized No user"});
    }

    const configApi = await loadConfigApi("GET_PRODUCTS");
    const environment = "prd";
    const slotNames = JSON.parse(await configApi.getConfigValue(CONFIG.LAMBDA_CONFIGS.GET_PRODUCTS.SLOT_NAMES, environment)) as SlotNames;

    const slot1 = [slotNames.slot1] || ["Home & Kitchen"];
    const slot2 = [slotNames.slot2] || ["Clothing, Shoes & Jewelry"];
    const slot3 = [slotNames.slot3] || ["Learning & Education"];
    const slot4 = [slotNames.slot4] || ["Hobbies"];
    const maxProducts = slotNames.maxProducts || 4;

    const featuredProducts = JSON.parse(await configApi.getConfigValue(CONFIG.LAMBDA_CONFIGS.GET_PRODUCTS.FEATURED_PRODUCTS, environment)) as Product[];
    const slot2Rules = configApi.configJson.ruleSets.find((ruleSet) => ruleSet.name === CONFIG.RULE_SETS.HOME_PAGE_PERSONALIZATION);
    const userInfo = {
        ...user,
        name: user.username,
        age: user.birthdate ? Math.floor((new Date().getFullYear() - new Date(user.birthdate).getFullYear())) : 25
    };
    if (slot2Rules) {
        const slot2RuleResult = executeRule(slot2Rules,
            configApi.configJson.predefinedLists, userInfo, environment);
        if (slot2RuleResult && slot2RuleResult.result) {
            slot2.push(String(slot2RuleResult.result));
        }
    }
    let nextGenFeature = false;
    const featureFlagRules = configApi.configJson.ruleSets.find((ruleSet) => ruleSet.name === CONFIG.RULE_SETS.NEXT_GEN_FEATURE);
    if (featureFlagRules) {
        const featureFlagRuleResult = executeRule(featureFlagRules,
            configApi.configJson.predefinedLists, userInfo, environment);
        nextGenFeature = featureFlagRuleResult.result ? true : false;
        console.log("featureFlagRuleResult", featureFlagRuleResult);
    }

    const getProducts = (slot: string[]) => {
        return PRODUCTS.filter((product) => {
            return slot.every((category) => {
                return product.categories.includes(category);
            });
        }).slice(0, maxProducts);
    };


    const slot1Products = getProducts(slot1);
    const slot2Products = getProducts(slot2);
    const slot3Products = getProducts(slot3);
    const slot4Products = getProducts(slot4);
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