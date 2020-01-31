import json
from urllib import request
from pathlib import Path
from os import path
from hashlib import sha256

repo_dir = path.dirname(path.dirname(path.realpath(__file__)))

DATA_URL_TEMPLATE = 'https://raw.githubusercontent.com/ModelSEED/ModelSEEDDatabase/dev/Biochemistry/{name}.json'
IMAGE_URL_TEMPLATE = 'http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/{cid}.png'
IMAGE_FILENAME = '{cid}.png'
DATA_DIR = '{root}/temp/data'.format(root=repo_dir)
IMAGE_DIR = '{root}/src/react-app/public/images/modelseed'.format(
    root=repo_dir)
TEMP_IMAGE_DIR = '{root}/temp/images/modelseed'.format(
    root=repo_dir)


def load_json(path):
    with open(path, "r") as data_file:
        data = json.load(data_file)
        return data


def download_data(name, destination):
    url = DATA_URL_TEMPLATE.format(name=name)
    filename = "{dir}/{name}.json".format(dir=DATA_DIR, name=name)
    request.urlretrieve(url, filename)


def file_path(dir, filename):
    m = sha256()
    m.update(bytes(filename, 'utf-8'))
    hash_dir = m.hexdigest()[0:2]
    return f'{dir}/{hash_dir}/{filename}'


def main():
    # Make the data directory, but only if it is not there already.
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
    Path(TEMP_IMAGE_DIR).mkdir(parents=True, exist_ok=False)
    download_data("compounds", DATA_DIR)
    download_data("reactions", DATA_DIR)

    compounds = load_json("{dir}/compounds.json".format(dir=DATA_DIR))
    total_images = len(compounds)
    image_count = 0
    start_at = 33963
    for compound in compounds:
        image_count += 1
        if image_count < start_at:
            continue
        print(f'fetching image {image_count} of {total_images}')
        filename = IMAGE_FILENAME.format(cid=compound['id'])
        filepath = file_path(IMAGE_DIR, filename)
        try:
            if not path.exists(filepath):
                print(f'MISSING {filepath}')
                url = IMAGE_URL_TEMPLATE.format(cid=compound['id'])
                request.urlretrieve(
                    url, "{dir}/{filename}".format(dir=TEMP_IMAGE_DIR,
                                                   filename=filename))
        except Exception as e:
            print('Error checking ${filepath}: ${message}'.format(
                filepath=filepath, message=str(e)))


main()
