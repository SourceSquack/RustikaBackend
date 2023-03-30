const deleteDish = async (event) => {
    const id = event.pathParameters
    return {
        statusCode: 200,
        body: JSON.stringify(id)
    }
};

module.exports = {deleteDish}