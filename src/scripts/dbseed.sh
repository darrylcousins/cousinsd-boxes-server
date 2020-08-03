
source .env

#PGPASSWORD=$DB_PASSWORD psql -h $DB_HOSTNAME -p $DB_PORT -d $DB_NAME -U $DB_USERNAME -c "DROP SCHEMA public CASCADE;"
#PGPASSWORD=$DB_PASSWORD psql -h $DB_HOSTNAME -p $DB_PORT -d $DB_NAME -U $DB_USERNAME -c  "CREATE SCHEMA public;"
#PGPASSWORD=$DB_PASSWORD psql -h $DB_HOSTNAME -p $DB_PORT -d $DB_NAME -U $DB_USERNAME -c  "GRANT ALL ON SCHEMA public TO postgres;"
#PGPASSWORD=$DB_PASSWORD psql -h $DB_HOSTNAME -p $DB_PORT -d $DB_NAME -U $DB_USERNAME -c  "GRANT ALL ON SCHEMA public TO public;"
#PGPASSWORD=$DB_PASSWORD psql -h $DB_HOSTNAME -p $DB_PORT -d $DB_NAME -U $DB_USERNAME -c  "COMMENT ON SCHEMA public IS 'standard public schema';"
# 
npx sequelize-cli db:migrate
npx sequelize-cli db:seed --seed shopifyboxes
npx sequelize-cli db:seed --seed subscriptiontypes
npx sequelize-cli db:seed --seed boxes
npx sequelize-cli db:seed --seed products
npx sequelize-cli db:seed --seed boxproducts
