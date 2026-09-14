import psycopg2

conn = psycopg2.connect(
    host="database-1.c3myk2y4c5fj.ap-southeast-1.rds.amazonaws.com",
    port=5432,
    database="postgres",
    user="postgres",
    password="C1fWkt5tVBd9K9aOkdRU",
)

print("Connected to RDS successfully!")

cursor = conn.cursor()
cursor.execute("SELECT version();")
print(cursor.fetchone())

cursor.close()
conn.close()