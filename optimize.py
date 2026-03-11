import os
import glob
from PIL import Image

image_dir = 'images'
files_to_update = glob.glob('*.html') + glob.glob('css/**/*.css', recursive=True)

converted_paths = {}

for ext in ('*.png', '*.jpg', '*.jpeg'):
    for filepath in glob.glob(os.path.join(image_dir, '**', ext), recursive=True):
        try:
            with Image.open(filepath) as img:
                # skip already webp or small icons if desired, but we'll do all
                new_filepath = filepath.rsplit('.', 1)[0] + '.webp'
                img.save(new_filepath, 'webp', quality=85)
                
                old_rel = filepath.replace('\\\\', '/')
                new_rel = new_filepath.replace('\\\\', '/')
                
                # handle both slash directions just in case
                converted_paths[old_rel] = new_rel
        except Exception as e:
            pass

count = 0
for fpath in files_to_update:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    changed = False
    for old_rel, new_rel in converted_paths.items():
        if old_rel in content:
            content = content.replace(old_rel, new_rel)
            changed = True
            
    if changed:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1

print('Processed {} images. Updated {} files.'.format(len(converted_paths), count))