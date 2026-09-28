import json,os,sys
from llama_cpp import Llama
model=Llama(model_path=os.environ.get('BINGNEWS_MODEL_PATH','models/newsroom.gguf'),n_ctx=8192,n_threads=4,verbose=False,chat_format='chatml')
for line in sys.stdin:
 try:
  req=json.loads(line)
  answer=model.create_chat_completion(messages=[{'role':'system','content':req['system']},{'role':'user','content':req['input']}],temperature=0.1,max_tokens=req.get('max_tokens',1400),response_format={'type':'json_object',**({'schema':req['schema']} if req.get('schema') else {})},repeat_penalty=1.12)
  print(json.dumps({'result':json.loads(answer['choices'][0]['message']['content'])}),flush=True)
 except Exception as e: print(json.dumps({'error':str(e)}),flush=True)
