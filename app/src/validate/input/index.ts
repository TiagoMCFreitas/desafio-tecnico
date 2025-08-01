export const validateInputSchemas = async (schema, value) => {
  try {
    const validationResult = schema.safeParse(value);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error!.issues.map((error) => {
        if (error.code === "unrecognized_keys") {
          return {
            campo: error.keys,
            mensagem: "Campo(s) inválido(s)",
          };
        }
        return { campo: error.path[0], mensagem: error.message };
      });

      return { error: true, errors: formattedErrors };
    }
    return { error: false, body: validationResult.data };
  } catch (error) {
    return error;
  }
};
