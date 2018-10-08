import h from 'react-hyperscript';

const EmptyEntries = () => (
  h('.not-found', { style: { marginBottom: 20, marginTop: 20 } }, [
    h('h3', { style: { textAlign: 'center ' } }, 'No journal entries yet!'),
    h('h4', { style: { textAlign: 'center' } }, 'Insert an entry in the form above to get started'),
  ])
);

export default EmptyEntries;
