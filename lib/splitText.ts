import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

const splitText = async (data: string) => {

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
    });
    
    const splitDocs = await textSplitter.splitDocuments([
        new Document({ pageContent: data})
    ]);

    return splitDocs;
};

export default splitText;
