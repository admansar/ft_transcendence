import requests
from rest_framework.response import Response

def get_user_from_api(username):
        """
        Function to get user details from the authentication service
        """
        try:
            url = f'http://auth:3000/api/auth/user/{username}/'
            headers = {
                'Content-Type': 'application/json',
            }        
            response = requests.get(url, headers=headers)
            print('response ===>', response)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching user data: {e}")
            return Response({"message": "Username not found!"}, status=404)