import Service from "@/libs/service";
import Role from "@/api/models/role";
export default class RoleService extends Service {
    
  constructor() {
    super();
  }
    async list() {
    try {
      const data = await this.http.get<Role[]>(`role`);
      return data;
    } catch (error) {
      throw Error("Unable to fetch data");
    }
  }
   async retrieve(id: number) {
    try {
      const data = await this.http.get<Role>(`role/${id}`);
      return data;
    } catch (error) {
      throw Error("Unable to fetch data");
    }
  }
  async create({ name, description }: Role){
     try {
        const data=await this.http.post(`role`,{
            name,
            description,
            status:1
        })
        return data;
    } catch (error) {
        throw Error("Unable to create role")
    }
  }
   async update(id: any,{ name, description }: Role){
     try {
        const data=await this.http.patch(`role/${id}`,{
            name,
            description,
            status:1
        })
        return data;
    } catch (error) {
        throw Error("Unable to update role")
    }
  }
   async delete(id: any){
     try {
        const data=await this.http.delete(`role/${id}`)
        return data;
    } catch (error) {
        throw Error("Unable to update role")
    }
  }

}
// export const fetchPosts=async (id:number)=>{
//     try {
//         const data=await api.get(`users/792293/posts?page=${id}`)
//         return data;
//     } catch (error) {
//         throw Error("Unable to fetch data")
//     }
// }

// export const fetchPost=async (id:number)=>{
//     try {
//         const data=await api.get(`users/792293/posts?id=${id}`)
//         return data;
//     } catch (error) {
//         throw Error("Unable to fetch data")
//     }
// }

// export const addNewPost=async ({title:title,body:title})=>{
//     try {
//         const data=await api.post(`users/792293/posts`,{
//             title,
//             body
//         })
//         return data;
//     } catch (error) {
//         throw Error("Unable to post data")
//     }
// }

// export const updatePost=async ({title,body,id})=>{
//     try {
//         const data=await api.patch(`posts/${id}`,{
//             title,
//             body
//         })
//         return data;
//     } catch (error) {
//         throw Error("Unable to post data")
//     }
// }
// export const deletePost=async ({id})=>{
//     try {
//         const data=await api.delete(`posts/${id}`)
//         return data;
//     } catch (error) {
//         throw Error("Unable to post data")
//     }
// }
