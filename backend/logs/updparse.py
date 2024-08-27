import socket


class SyslogUDPServer:

    def __init__(self, host="0.0.0.0", port=514, output_file="received_syslog.txt"):
        self.host = host
        self.port = port
        self.output_file = output_file

    def start(self):
        # Set up a UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind((self.host, self.port))

        print(f"Listening for UDP syslog messages on {self.host}:{self.port}...")
        
        try:
            with open(self.output_file, 'a') as file:  # Open file in append mode
                while True:
                    # Receive syslog packet
                    data, addr = sock.recvfrom(4096)  # Buffer size of 4096 bytes
                    syslog_message = data.decode('utf-8').strip()
                    
                    # Add a timestamp to each message
                    #formatted_message = f"{timestamp} {syslog_message}"

                    # Print to the terminal
                    print(f"Received message from {addr}: {syslog_message}")
                    
                    # Write to the file
                    file.write(syslog_message + "\n")

        except KeyboardInterrupt:
            print("\nServer stopped.")
        except Exception as e:
            print(f"Error receiving syslog messages: {e}")
        finally:
            sock.close()

if __name__ == "__main__":
    server = SyslogUDPServer(host="0.0.0.0", port=514, output_file="received_syslog.txt")
    server.start()