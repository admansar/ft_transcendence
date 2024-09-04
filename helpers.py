def expand_from_env(file_path: str, var_to_get : str) -> str:
    env_vars = {}
    check = ""
    try:
        with open(file_path) as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    except FileNotFoundError:
        print(f"Error: The file {file_path} does not exist.")
    try:
        check = env_vars.get(var_to_get)
    except Exception as e:
        print (f"{e}")
    return check