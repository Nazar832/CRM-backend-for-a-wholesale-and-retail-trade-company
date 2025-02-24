export const errorHandler = (err, req, res, next) => {
    console.log(err.message);

    if (err.name === 'ValidationError') {
        const formattedErrors = [];
        for (const field in err.errors) {
            formattedErrors.push(err.errors[field].message);
        }
        
        return res.status(400).json({error: formattedErrors.join('\n')});
    }

    if (err.status) return res.status(err.status).json({error: err.message});

    res.status(500).json({error: 'Something went wrong'});
}