import requests

class VaultClient:
    def __init__(self):
        self.vault_url = "http://vault:8200"
        f = open('/tmp/.key', 'r')
        self.token = f.read().strip()
        f.close()
        

    def secret(self, path):
        url = f"{self.vault_url}/v1/kv/{path}"
        headers = {"X-Vault-Token": self.token}
        response = requests.get(url, headers=headers)
        response_data = response.json()

        if response.status_code == 200:
            return response_data['data']
        else:
            raise Exception("Failed to fetch secret from Vault")