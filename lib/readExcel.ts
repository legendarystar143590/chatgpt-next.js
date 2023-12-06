
const reader = require('xlsx');

const getJsonFromExcel = async (filepath: string) => {

    const file = reader.readFile(filepath);
    let data: any[] = [];
  
    const sheets = file.SheetNames 
    
    for(let i = 0; i < sheets.length; i++) { 
        const temp = reader.utils.sheet_to_json( 
                file.Sheets[file.SheetNames[i]]) 
        temp.forEach((res:any) => { 
            data.push(res) 
        }); 
    }

    return data;
};

export default getJsonFromExcel;
