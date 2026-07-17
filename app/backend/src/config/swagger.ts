import swaggerJsdoc from "swagger-jsdoc";

// Main OpenAPI configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "MeetFlow API",
      version: "1.0.0",
      description:
        "API documentation for the MeetFlow real-time video conferencing platform",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    // Allows protected APIs to use JWT from Swagger
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // Swagger reads OpenAPI comments from these route files
  apis: [
    "./src/modules/**/*.route.ts",
    "./src/modules/**/*.routes.ts",
  ],
};

// Generate OpenAPI specification
export const swaggerSpec =
  swaggerJsdoc(swaggerOptions);