const getMetaData = async (url) => {
    const response = await fetch(`/api/getmetadata?url=${url}`);
    const data = await response.json();
    return data;
};

export default getMetaData;

