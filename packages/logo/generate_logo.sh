docker run --rm -v "$(pwd):/workspace" python:3.9-slim bash -c "
    apt-get update &&
    apt-get install -y woff2 &&
    pip install fonttools Pillow &&
    python /workspace/generate_logo.py
"
