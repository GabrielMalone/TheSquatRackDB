import csv
#------------------------------------------------------------------------------
import mysql.connector # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv # type: ignore
import os
from werkzeug.security import generate_password_hash, check_password_hash #type: ignore
#------------------------------------------------------------------------------
load_dotenv()
#------------------------------------------------------------------------------
def connect():
    return mysql.connector.connect(
        user=os.getenv('DB_USER'), 
        password=os.getenv('DB_PASSWORD'), 
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST', 'localhost') )
#------------------------------------------------------------------------------
def load_mock_users():
    cnx = connect()

    if not cnx.is_connected():
        return None
    
    with open('MOCK_DATA.csv', newline='', encoding='utf-8') as f:
        reader = csv.reader(f)

        for row in reader:
            email = row[0]
            userName = row[1]
            pword = row[2]
            userFirst = row[3]
            userLast = row[4]

            try:
                print('inserting new user')
                cursor = cnx.cursor(dictionary=True)
                cursor.execute(
                    '''
                    INSERT INTO User (Email, userName, passwordHash, userFirst, userLast)
                    VALUES (%s, %s, %s, %s, %s );
                    ''',
                    (email, userName, pword, userFirst, userLast)
                )
                cnx.commit()

            except mysql.connector.Error as err:
                cnx.rollback()
                print("MySQL Error:", err)

        cursor.close()
        cnx.close() 

