import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: import.meta.env.VITE_COSMOS_ENDPOINT,
  key: import.meta.env.VITE_COSMOS_KEY,
})

const database = client.database(import.meta.env.VITE_COSMOS_DATABASE)
const container = database.container(import.meta.env.VITE_COSMOS_CONTAINER)

export const saveToCosmosDB = async (company: string, qrData: string) => {
  try {
    await container.items.create({
      id: qrData,
      companyName: company, 
    })
  } catch (error) {
    console.error('Error saving to CosmosDB:', error)
    throw error
  }
}
