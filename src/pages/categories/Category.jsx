import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import DataTable from 'react-data-table-component';
import ActionsTemplate from '../../components/ActionsTemplate';
import CustomModal from '../../components/CustomModal';
import CategoryEdit from './CategoryEdit';
import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import TruncatedTooltipText from '../../components/TruncatedTooltipText';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [showEditMode, setShowEditMode] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
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
                    onSet={() => setSelectedCategoryId(row.id)}
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

    const handleEditClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setShowEditMode(true);
    };

    const handleCloseModal = () => {
        setShowEditMode(false);
        setTimeout(() => setSelectedCategoryId(null), 300);
    };

    const handleSaveCategory = () => {
        setRefreshData(prev => !prev);
        handleCloseModal();
    };

    const handleDelete = async (categoryId) => {
        try {
            const response = await CategoryService.delete(categoryId);
            if (response && response.success) {
                toast.success('Categoría eliminada exitosamente');
                setRefreshData(prev => !prev);
            } else {
                toast.error('Error al eliminar la categoría');
            }
        } catch (error) {
            toast.error('Error al eliminar la categoría');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await CategoryService.getAll();
                setCategories(data.data || data);
                setFilteredCategories(data.data || data);
            } catch (error) {
                console.error('Error Fetching Categories', error);
                toast.error('Error al cargar las categorías');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [refreshData]);

    useEffect(() => {
        const result = categories.filter(category => {
            const searchFields = [
                category.id?.toString() || '',
                category.name || '',
                category.description || ''
            ];

            return searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredCategories(result);
    }, [searchTerm, categories]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Categorías</h2>
            <div className="card p-4 shadow-sm border-0">
                <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="w-50">
                        <InputGroup.Text>
                            <Search />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedCategoryId(null);
                            setShowEditMode(true);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nueva Categoría
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredCategories}
                    pagination
                    paginationComponentOptions={paginationOptions}
                    progressPending={loading}
                    striped
                    highlightOnHover
                    responsive
                    pointerOnHover
                    persistTableHead
                    noDataComponent="No hay categorías disponibles"
                />

                <CustomModal
                    show={showEditMode}
                    handleClose={handleCloseModal}
                    title={selectedCategoryId ? `Editar Categoría #${selectedCategoryId}` : 'Nueva Categoría'}
                    size="lg"
                >
                    <CategoryEdit
                        categoryId={selectedCategoryId}
                        onClose={handleCloseModal}
                        onSave={handleSaveCategory}
                    />
                </CustomModal>
            </div>
        </div>
    );
};

export default Category;