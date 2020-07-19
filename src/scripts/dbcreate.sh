npx sequelize model:generate --name Shop --attributes name:string,shopify_name:string,shopify_id:bigint,email:string,url:string

npx sequelize model:generate --name Product --attributes name:string,handle:string,available:boolean,shopify_id:bigint,shopify_gid:string

npx sequelize model:generate --name Box --attributes handle:string,delivered:date,shopify_id:bigint,shopify_gid:string
