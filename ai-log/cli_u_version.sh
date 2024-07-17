#!/bin/bash

# Initialize variables with default values
username=""
password=""
zip_file=""

# Function to display script usage
usage() {
    echo "Usage: $0 -u <username> -p <password> -f <zip_file>"
    exit 1
}

# Parse command line options
while getopts ":u:p:f:" opt; do
    case $opt in
        u)
            username="$OPTARG"
            ;;
        p)
            password="$OPTARG"
            ;;
        f)
            zip_file="$OPTARG"
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            usage
            ;;
        :)
            echo "Option -$OPTARG requires an argument."
            usage
            ;;
    esac
done

# Check if required options are provided
if [ -z "$username" ]; then
    echo "Error: Missing required option -u (username)."
fi

if [ -z "$password" ]; then
    echo "Error: Missing required option -p (password)."
fi

if [ -z "$zip_file" ]; then
    echo "Error: Missing required option -f (ZIP file path)."
fi

# Exit if any required options are missing
if [ -z "$username" ] || [ -z "$password" ] || [ -z "$zip_file" ]; then
    usage
fi

# Set the endpoint URL
endpoint="http://galileo.softlab.ntua.gr:5000/upload"

# Perform the POST request
response=$(curl -X POST -F "username=$username" -F "password=$password" -F "file=@$zip_file" $endpoint)

# Display the response
echo "Server Response:"
echo "$response"
