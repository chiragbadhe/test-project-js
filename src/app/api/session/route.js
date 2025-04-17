// Simple in-memory store for sessions
const sessions = new Map();

export async function POST(request) {
  try {
    const { minutes } = await request.json();
    console.log("Received minutes:", minutes);

    if (!minutes || isNaN(parseInt(minutes)) || parseInt(minutes) <= 0) {
      return Response.json(
        { error: "Valid minutes are required" },
        { status: 400 }
      );
    }

    const milliseconds = parseInt(minutes) * 60 * 1000;
    const endTime = Date.now() + milliseconds;

    // Store session data
    sessions.set("timer-session", { endTime });

    // Set session cookie
    const response = new Response(
      JSON.stringify({
        success: true,
        message: "Session timer started",
        remainingTime: milliseconds,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Set cookie using standard headers
    const cookieValue = `session=active; Max-Age=${milliseconds}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    response.headers.set('Set-Cookie', cookieValue);

    console.log("Session created successfully");
    return response;
  } catch (error) {
    console.error("Session creation failed:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to start session timer",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const sessionCookie = request.headers
      .get("cookie")
      ?.includes("session=active");

    if (!sessionCookie) {
      return Response.json(
        { active: false, remainingTime: null },
        { status: 200 }
      );
    }

    const session = sessions.get("timer-session");
    if (!session) {
      return Response.json(
        { active: false, remainingTime: null },
        { status: 200 }
      );
    }

    const remainingTime = Math.max(0, session.endTime - Date.now());

    return Response.json({
      active: remainingTime > 0,
      remainingTime: remainingTime > 0 ? remainingTime : null,
    });
  } catch (error) {
    console.error("Session check failed:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to check session",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    sessions.delete("timer-session");

    const response = new Response(
      JSON.stringify({
        success: true,
        message: "Session ended",
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Clear cookie using standard headers
    response.headers.set('Set-Cookie', 'session=; Max-Age=0; HttpOnly; SameSite=Lax');

    return response;
  } catch (error) {
    console.error("Session end failed:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to end session",
      },
      { status: 500 }
    );
  }
}
