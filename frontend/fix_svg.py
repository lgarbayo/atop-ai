import re

path = 'assets/atop(ai).svg'
with open(path, 'r') as f:
    text = f.read()

text = re.sub(r'fill="rgb\(10.*?10.*?10\)"', 'class="logo-dark"', text)
text = re.sub(r'fill="rgb\(97.*?97.*?97\)"', 'class="logo-grey"', text)
text = re.sub(r'fill="rgb\(254.*?254.*?254\)"', 'class="logo-white"', text)

text = re.sub(r'M 0\.00 385\.00 L 0\.00 0\.00 L 385\.00 0\.00 L 770\.00 0\.00 L 770\.00 385\.00 L 770\.00 770\.00 L 385\.00 770\.00 L 0\.00 770\.00 L 0\.00 385\.00 ZM', 'M', text)

style = '''<style>
  .logo-dark { fill: rgb(10,10,10); }
  .logo-grey { fill: rgb(97,97,97); }
  .logo-white { fill: rgb(254,254,254); }
  @media (prefers-color-scheme: dark) {
    .logo-dark { fill: rgb(254,254,254); }
  }
</style>
<g>'''
if '<style>' not in text:
    text = text.replace('<g>', style)

with open(path, 'w') as f:
    f.write(text)
