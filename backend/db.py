import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="mth",
    user="postgres",
    password="root",
    port="5432"
)

cursor = conn.cursor()