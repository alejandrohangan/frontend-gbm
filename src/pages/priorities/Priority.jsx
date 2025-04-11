import React, { useEffect, useState } from 'react';
import PriorityService from '../../services/PriorityService';
import DataTable from 'react-data-table-component';
import ActionsTemplate from '../../components/ActionsTemplate';
import CustomModal from '../../components/CustomModal';
import PriorityEdit from './PriorityEdit';
import TruncatedTooltipText from '../../components/TruncatedTooltipText';
import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

const Priority = () => {
    const [priorities, setPriorities] = useState([]);
    const [showEditMode, setShowEditMode] = useState(false);
    const [selectedPriorityId, setSelectedPriorityId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPriorities, setFilteredPriorities] = useState([]);
    const [refreshData, setRefreshData] = useState(false);

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Nombre', selector: row => row.name, sortable: true },
        { name: 'Descripción', selector: row => <TruncatedTooltipText text={row.description} />, sortable: true },

        {
            name: 'Acciones',
            cell: (row) => (
                <ActionsTemplate
                    ticket={row}
                    onSet={() => setSelectedPriorityId(row.id)}
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

    const handleEditClick = (priorityId) => {
        setSelectedPriorityId(priorityId);
        setShowEditMode(true);
    };

    const handleCloseModal = () => {
        setShowEditMode(false);
        setTimeout(() => setSelectedPriorityId(null), 300);
    };

    const handleSavePriority = () => {
        setRefreshData(prev => !prev);
        handleCloseModal();
    };

    const handleDelete = async (priorityId) => {
        try {
            const response = await PriorityService.delete(priorityId);
            if (response && response.success) {
                toast.success('Prioridad eliminada exitosamente');
                setRefreshData(prev => !prev);
            } else {
                toast.error('Error al eliminar la prioridad');
            }
        } catch (error) {
            toast.error('Error al eliminar la prioridad');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                setLoading(true);
                const data = await PriorityService.getAll();
                setPriorities(data.data || data);
                setFilteredPriorities(data.data || data);
            } catch (error) {
                console.error('Error Fetching Priorities', error);
                toast.error('Error al cargar las prioridades');
            } finally {
                setLoading(false);
            }
        };

        fetchPriorities();
    }, [refreshData]);

    useEffect(() => {
        const result = priorities.filter(priority => {
            const searchFields = [
                priority.id?.toString() || '',
                priority.name || '',
                priority.description || ''
            ];

            return searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredPriorities(result);
    }, [searchTerm, priorities]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Prioridades</h2>
            <div className="card p-4 shadow-sm border-0">
                <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="w-50">
                        <InputGroup.Text>
                            <Search />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar prioridades..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedPriorityId(null);
                            setShowEditMode(true);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nueva Prioridad
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredPriorities}
                    pagination
                    paginationComponentOptions={paginationOptions}
                    progressPending={loading}
                    striped
                    highlightOnHover
                    responsive
                    pointerOnHover
                    persistTableHead
                    noDataComponent="No hay prioridades disponibles"
                />

                <CustomModal
                    show={showEditMode}
                    handleClose={handleCloseModal}
                    title={selectedPriorityId ? `Editar Prioridad #${selectedPriorityId}` : 'Nueva Prioridad'}
                    size="lg"
                >
                    <PriorityEdit
                        priorityId={selectedPriorityId}
                        onClose={handleCloseModal}
                        onSave={handleSavePriority}
                    />
                </CustomModal>
            </div>
        </div>
    );
};

export default Priority;