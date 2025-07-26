docker run --rm -v "$(pwd):/workspace" python:3.9-slim bash -c "
    apt-get update &&
    apt-get install -y woff2 &&
    pip install fonttools &&
    pyftsubset /workspace/MPLUSRounded1c-Regular.ttf --text='♪' --output-file=/workspace/logo.ttf &&
    woff2_compress /workspace/logo.ttf
"
