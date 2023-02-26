
import { ConfigJson } from "@euxdt/node-rules-engine";
import { getNodeJsConfigApi, ConfigApi } from "@euxdt/node-rules-engine";
import configJson from "../config.json";
import * as fs from "fs";


//Since this is a demo, we are going to store the config in a file. 
//In a real world scenario, you would store the config in a database or a key value store.
//You would poll the database/key value store for changes and update the config when it changes.
//for the purpose of this demo, you can overwrite the config.json file and the config will be reloaded.
//Similar to how we check the last modified date of the config file, you would check the last modified date of the config in the database/key value store
//and only reload the config if it has changed.


const configFileLocation = process.env.CONFIG_FILE_LOCATION || "/tmp/config.json";
export const loadConfigApi = async (lambdaName:string):Promise<ConfigApi> => {
    const configApi = await getNodeJsConfigApi(
        {
            lambdaName,
            loadConfig: async (lastRefreshed?:Date, existingConfig?:ConfigJson) => {
                const configExists = fs.existsSync(configFileLocation);
                if(configExists && lastRefreshed && existingConfig){
                    const fileModifiedDate =  fs.statSync(configFileLocation).mtime;
                    if(lastRefreshed && fileModifiedDate && lastRefreshed.getTime() >= fileModifiedDate.getTime()){
                        console.log("Config is up to date");
                        return existingConfig;  
                    }
                }
                console.log("Loading Config");
                if(!configExists){
                    console.log("Config file does not exist, creating");
                    fs.writeFileSync(configFileLocation, JSON.stringify(configJson));
                }
                console.log("Config Json",  configJson);
                const result = (configJson);
                console.log("Config Json", { configJson });
                return result as unknown as ConfigJson;
            },
            log: (level, message, extra) => {
                console.log(level, message, extra);
            }
        }
    );
    return configApi;
};
