
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

//For enterprise customers with an API key, you can uncomment the code below to load the config from the server

// const apiKey = "YOUR_API_KEY";
// const environment = "dev";
// const headers =  {
//     "x-api-key": apiKey,
//     "environment": environment
// };
// export const loadConfigApi = async (lambdaName:string):Promise<ConfigApi> => {
//     const configApi = await getNodeJsConfigApi(
//         {
//             lambdaName,
//             cacheDurationSeconds: 60,
//             loadConfig: async (lastRefreshed?:Date, existingConfig?:ConfigJson) => {
//                 // Once you have an API key, you can uncomment this code to load the config from the server
//                 if(lastRefreshed && existingConfig){
//                     const configLastUpdated = await fetch("https://config.lambdagenie.com/lastUpdated", {
//                         method: "POST",
//                         headers
//                     }).then((res) => res.json()).then((json) => new Date(json.updatedAt));
//                     console.log("Last Refreshed", lastRefreshed, "Config Last Updated", configLastUpdated);
//                     if(lastRefreshed && configLastUpdated && lastRefreshed.getTime() >= configLastUpdated.getTime()){
//                         console.log("Config is up to date");
//                         return existingConfig;  
//                     }
//                 }
//                 console.log("Loading Config");
//                 const file = await fetch("https://config.lambdagenie.com/config", {
//                     method: "POST",
//                     headers
//                 }).then((res) => res.json());
//                 const configJson = file;
//                 console.log("Config Json", { configJson });
//                 return configJson as unknown as ConfigJson;

//             },
//             log: (level, message, extra) => {
//                 console.log(level, message, extra);
//             }
//         }
//     );
//     return configApi;
// };
