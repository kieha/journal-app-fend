import PropTypes from 'prop-types';
import h from 'react-hyperscript';

const DeleteEntryButton = ({ onClick }) => (
  h('', { style: { position: 'absolute' } }, h('button.btn.btn-danger', {
    onClick,
    style: { border: '1px solid transparent', borderRadius: 2 },
    type: 'button',
  }, 'Delete Entry'))
);

DeleteEntryButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default DeleteEntryButton;
