export const verifyHasUserInput = (req, res, next) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).send({ error: 'Text input is required' });
  }

  next();
};
