# server.py
# from flask import Flask, render_template

# app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route("/hello")
# def hello():
#     return "Hello World!”

# if __name__ == "__main__":
# app.run()


import pysam
from bwapy import BwaAligner
index = 'path/to/index'  # the path given to bwa index
seq = 'ACGATCGCGATCGA'

aligner = BwaAligner(index)
alignments = aligner.align_seq(seq)
print('Found {} alignments.'.format(len(alignments))
for aln in alignments:
    print('  ', aln)
