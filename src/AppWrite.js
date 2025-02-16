import { Client, Databases, ID, Query } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const dbId = import.meta.env.VITE_APPWIRTE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(projectId);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Check if the search term already exists
    const result = await database.listDocuments(dbId, collectionId, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // Update existing search term count
      await database.updateDocument(dbId, collectionId, doc.$id, {
        count: doc.count + 1,
        lastSearched: new Date().toISOString(),
      });
    } else {
      // Create a new document if the search term is not found
      await database.createDocument(dbId, collectionId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`, // Corrected poster path
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(dbId, collectionId, [
      Query.limit(10),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};
