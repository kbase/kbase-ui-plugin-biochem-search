import * as forge from 'node-forge';

// export const compound_image_src = (cid) => {
//     return `http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/${cid}.png`;
// };
// export const github_url = 'https://raw.githubusercontent.com/ModelSEED/ModelSEEDDatabase/dev/Biochemistry';
// export const relation_engine_url = 'https://ci.kbase.us/services/relation_engine_api/api/v1/query_results';

export function compoundImagePath(cid) {
    const imageFileName = `${cid}.png`;
    const md = forge.md.sha256.create();
    const hashed = md.update(imageFileName).digest().toHex();
    const prefix = hashed.substr(0, 2)
    // return `images/modelseed/${prefix}/${imageFileName}`;
    return `https://raw.githubusercontent.com/eapearson/kbase-ui-plugin-biochem-search/master/resources/modelseed/${prefix}/${imageFileName}`
}