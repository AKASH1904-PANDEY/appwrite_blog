import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";


export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createOperations(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                  title,
                  content,
                  featuredImage,
                  status,
                  userId,  
                }
            )
        } catch (error) {
            throw error;
        }
    }
    
    async updatePost(slug, {title, content, featuredImage, status, }){
        try {
            return await this.databases.updateTransaction(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async deletePost(slug){
        try {
         await this.databases.deleteTransaction(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            throw error
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getTransaction(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status","active")]){ 
        try {
            return await this.databases.listTransactions(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
               
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    async uploadFile(file){
        try {
           return await this.bucket.createOperations(
            conf.appwriteBucketId,
            ID.unique(),
            file
           ) 
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteTransaction(
                conf.appwriteBucketId,
                fileId
            )
            return true;
            
        } catch (error) {
            throw error;
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getTransaction(
            conf.appwriteBucketId,
            fileId
        )
    }

}

const service = new Service();

export default service