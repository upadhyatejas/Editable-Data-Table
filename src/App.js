import { prettyDOM } from "@testing-library/react";
import React, { useEffect, useState } from "react";

const API_HOST = "http://localhost:3000";
const INVENTORY_API_URL = `${API_HOST}/inventory`;

function App() {
  const [data, setData] = useState([]);

  const fetchInventory = () => {
    fetch(`${INVENTORY_API_URL}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const [unitPrice, setUnitPrice] = useState(null);
  const [productCategory, setProductCategory] = useState(null);

  /**
   *
   * @param id - The id of the product
   * @param currentUnitPrice - The current unit price of the product
   */
  const onEdit = ({ id, currentUnitPrice, currentProductCategory }) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });
    setUnitPrice(currentUnitPrice);
    setProductCategory(currentProductCategory);
  };

  /**
   *
   * @param id
   * @param newUnitPrice
   */
  const updateInventory = ({ id, newUnitPrice, newProductCategory }) => {
    fetch(`${INVENTORY_API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        unit_price: newUnitPrice,
        product_category: newProductCategory,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // reset inEditMode and unit price state values
        onCancel();

        // fetch the updated data
        fetchInventory();
      });
  };

  /**
   *
   * @param id -The id of the product
   * @param newUnitPrice - The new unit price of the product
   */
  const onSave = ({ id, newUnitPrice, newProductCategory }) => {
    updateInventory({ id, newUnitPrice, newProductCategory });
  };

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null,
    });
    // reset the unit price state value
    setUnitPrice(null);
  };

  return (
    <div className="container">
      <h1>Simple Inventory Table</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Category</th>
            <th>Unit Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>
                {inEditMode.status && inEditMode.rowKey === item.id ? (
                  <input
                    value={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                  />
                ) : (
                  item.product_category
                )}
              </td>
              <td>
                {inEditMode.status && inEditMode.rowKey === item.id ? (
                  <input
                    value={unitPrice}
                    onChange={(event) => setUnitPrice(event.target.value)}
                  />
                ) : (
                  item.unit_price
                )}
              </td>
              <td>
                {inEditMode.status && inEditMode.rowKey === item.id ? (
                  <React.Fragment>
                    <button
                      className={"btn-success"}
                      onClick={() =>
                        onSave({
                          id: item.id,
                          newUnitPrice: unitPrice,
                          newProductCategory: productCategory,
                        })
                      }
                    >
                      Save
                    </button>

                    <button
                      className={"btn-secondary"}
                      style={{ marginLeft: 8 }}
                      onClick={() => onCancel()}
                    >
                      Cancel
                    </button>
                  </React.Fragment>
                ) : (
                  <button
                    className={"btn-primary"}
                    onClick={() =>
                      onEdit({
                        id: item.id,
                        currentUnitPrice: item.unit_price,
                        currentProductCategory: item.product_category,
                      })
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
