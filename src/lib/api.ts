// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Types for API requests
export interface MoodDataPayload {
  summary: string;
  mood: "sad" | "angry" | "happy" | "good" | "excited";
  energy_level: number; // 1-5 scale
  complexity: "easy" | "medium" | "hard" | "very_hard";
  satisfaction: number; // 1-10 scale
}

// API service class
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0ZXIiLCJ1c2VyX2lkIjoyLCJzY29wZXMiOlsidXNlciJdLCJleHAiOjE3NTMxOTM2NjV9.apOy5hNXpxoHfuv0TupFowb-sd7JjXE9xXOymuNrr8s",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Submit mood data to backend
  async submitMoodData(
    data: MoodDataPayload
  ): Promise<{ success: boolean; id?: string }> {
    return this.request<{ success: boolean; id?: string }>("/vibe-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get user's mood history (optional for future use)
  async getMoodHistory(userId?: string): Promise<MoodDataPayload[]> {
    const endpoint = userId ? `/mood-data?userId=${userId}` : "/mood-data";
    return this.request<MoodDataPayload[]>(endpoint);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper function to map frontend mood values to backend enum
export const mapMoodToEnum = (moodIndex: number): MoodDataPayload["mood"] => {
  const moodMap: Record<number, MoodDataPayload["mood"]> = {
    0: "angry", // 😡
    1: "sad", // 😢
    2: "happy", // 😊
    3: "good", // 😌
    4: "excited", // 😄 (Joy -> Excited)
  };
  return moodMap[moodIndex] || "happy";
};

// Helper function to map complexity levels to backend enum
export const mapComplexityToEnum = (
  complexityId: number
): MoodDataPayload["complexity"] => {
  const complexityMap: Record<number, MoodDataPayload["complexity"]> = {
    1: "easy",
    2: "medium",
    3: "hard",
    4: "very_hard", // Super Hard -> Very Hard
  };
  return complexityMap[complexityId] || "easy";
};

// Helper function to convert satisfaction ratio (0-1) to 1-10 scale
export const mapSatisfactionToScale = (ratio: number): number => {
  // Convert 0-1 ratio to 1-10 scale
  return Math.max(1, Math.min(10, Math.round(ratio * 9 + 1)));
};
