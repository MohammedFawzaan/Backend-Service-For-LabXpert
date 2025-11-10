const sample = (req, res) => {
    res.status(200).json({ message: "hello there !" });
}

export { sample }