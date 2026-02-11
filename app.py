import subprocess
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the frontend
CORS(app)

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '')

    if not code:
        return jsonify({'error': 'No code provided.'}), 400

    try:
        # Use subprocess.run to execute the code safely in a new process
        # A timeout is crucial to prevent infinite loops from hanging the server
        result = subprocess.run(
            [sys.executable, '-c', code],
            capture_output=True,
            text=True,
            timeout=5  # 5-second timeout
        )

        # If the process returned an error code, send back the standard error
        if result.returncode != 0:
            return jsonify({'output': result.stderr})
        
        # Otherwise, send back the standard output
        return jsonify({'output': result.stdout})

    except subprocess.TimeoutExpired:
        return jsonify({'output': 'Execution timed out! (Possible infinite loop)'})
    except Exception as e:
        return jsonify({'output': f'An unexpected server error occurred: {str(e)}'})

if __name__ == '__main__':
    # This must be running for the frontend to connect to it
    app.run(debug=True, port=5000)
