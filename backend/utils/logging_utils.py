import os

def ensure_log_directory_and_file(base_dir, log_dir, log_file):
    """
    Ensure that the log directory and file exist.
    If they don't exist, create them.
    
    :param base_dir: The base directory of your project
    :param log_dir: The name of the log directory
    :param log_file: The name of the log file
    :return: The full path to the log file
    """
    # Construct the full path to the log directory
    log_dir_path = os.path.join(base_dir, log_dir)
    
    # Create the log directory if it doesn't exist
    if not os.path.exists(log_dir_path):
        os.makedirs(log_dir_path)
    
    # Construct the full path to the log file
    log_file_path = os.path.join(log_dir_path, log_file)
    
    # Create the log file if it doesn't exist
    if not os.path.exists(log_file_path):
        open(log_file_path, 'a').close()
    
    return log_file_path