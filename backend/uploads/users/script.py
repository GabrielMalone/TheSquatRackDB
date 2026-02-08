import os
import requests
#------------------------------------------------------------------------------
import mysql.connector # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv # type: ignore
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

import os
import requests
import random

START_ID = 7
COUNT = 1000
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
SIZE = 256

# STYLES = [
#     "bottts",
#     "identicon"
# ]

# os.makedirs(OUTPUT_DIR, exist_ok=True)

# current_id = START_ID

# for i in range(COUNT):
#     seed = f"user_{current_id}"

#     style = random.choice(STYLES)

#     url = (
#         f"https://api.dicebear.com/7.x/{style}/png"
#         f"?seed={seed}"
#         f"&size={SIZE}"
#         f"&backgroundColor=0f0f0f"
#         f"&scale=110"
#         f"&radius=0"
#     )

#     user_dir = os.path.join(OUTPUT_DIR, str(current_id))
#     os.makedirs(user_dir, exist_ok=True)

#     img_path = os.path.join(user_dir, "profilePic.jpg")

#     img_data = requests.get(url).content
#     with open(img_path, "wb") as f:
#         f.write(img_data)

#     print(f"{current_id}: {style}")
#     current_id += 1

# print("Done.")



# cnx = connect()
# cursor = cnx.cursor(dictionary=True)
# for i in range(COUNT):
#         cursor.execute(
#             '''
#             UPDATE
#                 `User`
#             SET
#                 `hasProfilePic` = 1
#             WHERE 
#                 idUser = %s
#             ''',
#             (i,)
#         )
#         idMessage = cursor.lastrowid
#         cnx.commit()

CHOICES = [
    1,
    0
]

cnx = connect()
cursor = cnx.cursor(dictionary=True)
for i in range(COUNT):
        c = random.choice(CHOICES)
        cursor.execute(
            '''
            UPDATE
                `User`
            SET
                `isLoggedIn`= 0
            WHERE 
                idUser = %s
            ''',
            (i,)
        )
        idMessage = cursor.lastrowid
        cnx.commit()

print("Done.")