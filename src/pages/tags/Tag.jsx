import React, { useEffect, useState } from 'react';
import TagService from '../../services/TagService';
import DataTable from 'react-data-table-component';
import ActionsTemplate from '../../components/ActionsTemplate';
import CustomModal from '../../components/CustomModal';
import TagEdit from './TagEdit';
import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

const Tag = () => {
    const [tags, setTags] = useState([]);
    const [showEditMode, setShowEditMode] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTags, setFilteredTags] = useState([]);
    const [refreshData, setRefreshData] = useState(false);

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Nombre', selector: row => row.name, sortable: true },
        {
            name: 'Acciones',
            cell: (row) => (
                <ActionsTemplate
                    ticket={row}
                    onSet={() => setSelectedTagId(row.id)}
                    onEdit={() => handleEditClick(row.id)}
                    onDelete={() => handleDelete(row.id)}
                    hasDelete={true}
                />
            )
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Filas por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const handleEditClick = (tagId) => {
        setSelectedTagId(tagId);
        setShowEditMode(true);
    };

    const handleCloseModal = () => {
        setShowEditMode(false);
        setTimeout(() => setSelectedTagId(null), 300);
    };

    const handleSaveTag = () => {
        setRefreshData(prev => !prev);
        handleCloseModal();
    };

    const handleDelete = async (tagId) => {
        try {
            const response = await TagService.delete(tagId);
            if (response && response.success) {
                toast.success('Etiqueta eliminada exitosamente');
                setRefreshData(prev => !prev);
            } else {
                toast.error('Error al eliminar la etiqueta');
            }
        } catch (error) {
            toast.error('Error al eliminar la etiqueta');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const data = await TagService.getAll();
                setTags(data.data || data);
                setFilteredTags(data.data || data);
            } catch (error) {
                console.error('Error Fetching Tags', error);
                toast.error('Error al cargar las etiquetas');
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [refreshData]);

    useEffect(() => {
        const result = tags.filter(tag => {
            const searchFields = [
                tag.id?.toString() || '',
                tag.name || ''
            ];

            return searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredTags(result);
    }, [searchTerm, tags]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Etiquetas</h2>
            <div className="card p-4 shadow-sm border-0">
                <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="w-50">
                        <InputGroup.Text>
                            <Search />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar etiquetas..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedTagId(null);
                            setShowEditMode(true);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nueva Etiqueta
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredTags}
                    pagination
                    paginationComponentOptions={paginationOptions}
                    progressPending={loading}
                    striped
                    highlightOnHover
                    responsive
                    pointerOnHover
                    persistTableHead
                    noDataComponent="No hay etiquetas disponibles"
                />

                <CustomModal
                    show={showEditMode}
                    handleClose={handleCloseModal}
                    title={selectedTagId ? `Editar Etiqueta #${selectedTagId}` : 'Nueva Etiqueta'}
                    size="lg"
                >
                    <TagEdit
                        tagId={selectedTagId}
                        onClose={handleCloseModal}
                        onSave={handleSaveTag}
                    />
                </CustomModal>
            </div>
        </div>
    );
};

export default Tag;