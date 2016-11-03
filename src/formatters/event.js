
const isEventValid = event => event.name !== undefined;
const formatEventAsParams = event => `events=[${JSON.stringify(event)}]`;

const event = event => {
    if (isEventValid(event)) {
        let params;
        try {
            params = formatEventAsParams(event);
        } catch (e) {
            return;
        }

        return params;
    }
};

export default event;