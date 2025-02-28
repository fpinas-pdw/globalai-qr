import http from "./httpService"

export interface CosmosService_Interface {
  id: string,
  userId: string,
  name: string
}

class CosmosService {
  public static async pushData(
    request: CosmosService_Interface
  ): Promise<boolean> {
      try {
          const response = await http.post("api/ScanUser", request);
          return response.status === 200;
      } catch (error) {
          console.error('Error pushing data:', error);
          throw error;
      }
  }
}

export default CosmosService