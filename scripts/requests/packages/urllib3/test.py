text = u'hi\xe2'
try:
    print(text.encode('ascii'))
except UnicodeEncodeError:
    print('except')
    print(text.encode('utf-8'))