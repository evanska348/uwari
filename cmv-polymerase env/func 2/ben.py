import json
import argparse
import Bio
import subprocess
import sys

def lambda_handler(event, context):
  print('hello from lambda handler')
  return {
    'statusCode': 200,
  }
