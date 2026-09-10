import datetime

import psycopg2

from config.settings import settings


PG_URL = settings.db_url

def verify_and_setup_infrastructure():    
    with psycopg2.connect(PG_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL,
                    user_name VARCHAR(50) NOT NULL,
                    number TEXT NOT NULL,
                    time VARCHAR(30)
                );
            """)
            conn.commit()
    print("Chat history table verified/created.")

def add_transaction(user_id: str, user_name: str, number: str):
    x = datetime.datetime.now()
    formatted_time = x.strftime("%d-%m-%Y %H:%M:%S")

    with psycopg2.connect(PG_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO chat_history (user_id, user_name, number, time)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
            """, (user_id, user_name, number, formatted_time))
            
            inserted_id = cur.fetchone()[0]
            conn.commit()
            print(f" Saved at ID: {inserted_id}")

def display_live_db(user_id: str):
    print(f"\n--- Conversation History for Session: {user_id} ---")
    with psycopg2.connect(PG_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT number, time
                FROM chat_history 
                WHERE user_id = %s 
                ORDER BY time DESC;
            """, (user_id,))
            
            results = []
            for row in cur.fetchall():
                number, time = row
                results.append({"number": number, "time": time})
            return results
       