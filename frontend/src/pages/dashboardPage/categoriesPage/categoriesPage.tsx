import PageHeader from "@/components/ui/pageHeader.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {Button} from "@/components/ui/button.tsx";
import NewCategoryModal from "@/pages/dashboardPage/categoriesPage/NewCategoryModal/NewCategoryModal.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/categoriesPage/categoriesTable/TableColumns.tsx";
import {useMemo, useState} from "react";
import {useCategories} from "@/context/categoriesContext.tsx";
import RemoveCategoryModal from "@/pages/dashboardPage/categoriesPage/removeCategoryModal.tsx";

export default function CategoriesPage() {
    const {categories, remove:removeCategories} = useCategories();
    const [rowSelection, setRowSelection] = useState({});
    const [openRemoveModal, setOpenRemoveModal] = useState(false);

    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => categories[parseInt(index)].id);
    }, [rowSelection]);

    return (
        <PageContainer>
            <PageHeader>Categories</PageHeader>
            <div className="space-y-10">
                <div className="flex gap-2.5">
                    <NewCategoryModal>
                        <Button variant="default">New Category</Button>
                    </NewCategoryModal>
                    {selectedIds.length > 0 && <>
                        <RemoveCategoryModal
                            open={openRemoveModal}
                            setOpen={setOpenRemoveModal}
                            onConfirmDelete={() => {
                                removeCategories(selectedIds);
                                setRowSelection({});
                            }}
                        >
                            <Button variant="outline">Delete</Button>
                        </RemoveCategoryModal>
                    </>}
                </div>
                <DataTable
                    columns={tableColumns}
                    data={categories}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    filterByColumn="name"
                    filterText="categories"
                />
            </div>
        </PageContainer>
    )
}