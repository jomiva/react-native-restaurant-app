import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { map } from 'lodash';
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

const AccountOptions = ({ userInfo, toastRef, setReloadUserInfo }) => {
  const { displayName, email } = userInfo;
  const [isVisible, setIsVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const menuOptions = generateOptions();

  const selectComponent = (key) => {
    switch (key) {
      case 'displayName':
        setIsVisible(true);
        return setRenderComponent(
          <ChangeDisplayNameForm
            displayName={displayName}
            setIsVisible={setIsVisible}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );

      case 'email':
        setIsVisible(true);
        return setRenderComponent(
          <ChangeEmailForm
            email={email}
            setIsVisible={setIsVisible}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );

      case 'password':
        setIsVisible(true);
        return setRenderComponent(
          <ChangePasswordForm
            setIsVisible={setIsVisible}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );

      default:
        return setRenderComponent(null);
    }
  };

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          containerStyle={styles.menuItem}
          onPress={() => {
            selectComponent(menu.name);
          }}
        >
          <Icon
            name={menu.iconNameLeft}
            type={menu.iconType}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      {renderComponent && (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
};

const generateOptions = () => {
  return [
    {
      title: 'Cambiar Nombre y Apellidos',
      iconType: 'material-community',
      iconNameLeft: 'account-circle',
      iconColorLeft: '#ccc',
      name: 'displayName',
    },
    {
      title: 'Cambiar Email',
      iconType: 'material-community',
      iconNameLeft: 'at',
      iconColorLeft: '#ccc',
      name: 'email',
    },
    {
      title: 'Cambiar Contraseña',
      iconType: 'material-community',
      iconNameLeft: 'lock-reset',
      iconColorLeft: '#ccc',
      name: 'password',
    },
  ];
};

export default AccountOptions;

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
});
