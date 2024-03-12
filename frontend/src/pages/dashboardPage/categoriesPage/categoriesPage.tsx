import PageHeader from "@/components/ui/pageHeader.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {Button} from "@/components/ui/button.tsx";
import NewCategoryModal from "@/pages/dashboardPage/categoriesPage/NewCategoryModal/NewCategoryModal.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/categoriesPage/categoriesTable/TableColumns.tsx";
import {useState} from "react";
import {useCategories} from "@/context/categoriesContext.tsx";

export default function CategoriesPage() {
    const {categories} = useCategories();
    const [selectedCategories, setSelectedCategories] = useState({});

    return (
        <PageContainer>
            <PageHeader>Categories</PageHeader>
            <div className="space-y-10">
                <NewCategoryModal>
                    <Button variant="default">New Category</Button>
                </NewCategoryModal>
                <DataTable
                    columns={tableColumns}
                    data={categories}
                    rowSelection={selectedCategories}
                    setRowSelection={setSelectedCategories}
                    filterByColumn="name"
                    filterText="categories"
                />
            </div>
        </PageContainer>
    )
}