import psycopg2

conn = psycopg2.connect(
    host='cal-del-db.c98o68wiogq7.ap-south-1.rds.amazonaws.com',
    port=5432,
    database="mydb",
    user="foo",
    password="foobarbaz",
)

print("Connected to RDS successfully!")

cursor = conn.cursor()
cursor.execute("SELECT version();")
print(cursor.fetchone())

cursor.close()
conn.close()